// js/db.js — All table CRUD functions

// ===== Analysis Results =====

async function savePersonalColorResult(analysis) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('analysis_results').upsert({
            id: currentUser.id,
            pc_type: analysis.type,
            pc_confidence: analysis.confidence,
            pc_warmth: analysis.warmth,
            pc_depth: analysis.depth,
            pc_clarity: analysis.clarity,
            pc_skin_rgb: analysis.skinRgb,
            pc_scores: analysis.scores,
            pc_analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (result.error) throw result.error;
        showShareToast('Personal color result saved! 퍼스널컬러 결과가 저장되었습니다!');
    } catch (e) {
        console.error('Save PC result error:', e);
        showShareToast('Failed to save. Please try again. 저장에 실패했습니다.');
    }
}

async function saveFaceShapeResult(shapeResult) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('analysis_results').upsert({
            id: currentUser.id,
            fs_shape: shapeResult.shape,
            fs_confidence: shapeResult.confidence,
            fs_scores: shapeResult.scores,
            fs_analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (result.error) throw result.error;
        showShareToast('Face shape result saved! 얼굴형 결과가 저장되었습니다!');
    } catch (e) {
        console.error('Save FS result error:', e);
        showShareToast('Failed to save. Please try again. 저장에 실패했습니다.');
    }
}

async function saveSkinResult(skinScores, overallScore) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('analysis_results').upsert({
            id: currentUser.id,
            skin_redness: skinScores.redness,
            skin_oiliness: skinScores.oiliness,
            skin_dryness: skinScores.dryness,
            skin_dark_spots: skinScores.darkSpots,
            skin_texture: skinScores.texture,
            skin_overall_score: overallScore,
            skin_analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (result.error) throw result.error;
        showShareToast('Skin analysis saved! 피부 분석 결과가 저장되었습니다!');
    } catch (e) {
        console.error('Save skin result error:', e);
        showShareToast('Failed to save. Please try again. 저장에 실패했습니다.');
    }
}

async function saveQuizResult(skinType, season, quizScores) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('analysis_results').upsert({
            id: currentUser.id,
            quiz_type: skinType,
            quiz_season: season,
            quiz_scores: quizScores,
            quiz_taken_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        if (result.error) throw result.error;
        showShareToast('Quiz result saved! 퀴즈 결과가 저장되었습니다!');
    } catch (e) {
        console.error('Save quiz result error:', e);
        showShareToast('Failed to save. Please try again. 저장에 실패했습니다.');
    }
}

async function loadAnalysisResults() {
    if (!supabase || !currentUser) return null;
    try {
        var result = await supabase.from('analysis_results')
            .select('*')
            .eq('id', currentUser.id)
            .single();
        if (result.error && result.error.code !== 'PGRST116') throw result.error;
        return result.data || null;
    } catch (e) {
        console.error('Load analysis results error:', e);
        return null;
    }
}

// ===== Skin Diary =====

async function saveDiaryEntry(entry) {
    if (!supabase || !currentUser) return null;
    try {
        var data = {
            user_id: currentUser.id,
            entry_date: entry.entry_date,
            overall_condition: entry.overall_condition || null,
            sleep_hours: entry.sleep_hours || null,
            stress_level: entry.stress_level || null,
            water_intake: entry.water_intake || null,
            notes: entry.notes || null,
            updated_at: new Date().toISOString()
        };
        if (entry.ai_scores) {
            data.ai_redness = entry.ai_scores.redness;
            data.ai_oiliness = entry.ai_scores.oiliness;
            data.ai_dryness = entry.ai_scores.dryness;
            data.ai_dark_spots = entry.ai_scores.darkSpots;
            data.ai_texture = entry.ai_scores.texture;
            data.ai_overall_score = entry.ai_scores.overallScore;
        }

        var result = await supabase.from('skin_diary')
            .upsert(data, { onConflict: 'user_id,entry_date' });
        if (result.error) throw result.error;
        showShareToast('Diary entry saved! 일지가 저장되었습니다!');
        return result.data;
    } catch (e) {
        console.error('Save diary error:', e);
        showShareToast('Failed to save diary. 일지 저장에 실패했습니다.');
        return null;
    }
}

async function loadDiaryEntries(days) {
    if (!supabase || !currentUser) return [];
    try {
        var fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (days || 14));
        var fromStr = fromDate.toISOString().split('T')[0];

        var result = await supabase.from('skin_diary')
            .select('*')
            .eq('user_id', currentUser.id)
            .gte('entry_date', fromStr)
            .order('entry_date', { ascending: false });
        if (result.error) throw result.error;
        return result.data || [];
    } catch (e) {
        console.error('Load diary error:', e);
        return [];
    }
}

async function deleteDiaryEntry(entryId) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('skin_diary')
            .delete()
            .eq('id', entryId)
            .eq('user_id', currentUser.id);
        if (result.error) throw result.error;
        showShareToast('Entry deleted. 일지가 삭제되었습니다.');
    } catch (e) {
        console.error('Delete diary error:', e);
        showShareToast('Failed to delete. 삭제에 실패했습니다.');
    }
}

// ===== Routines =====

async function saveRoutine(routineType, steps) {
    if (!supabase || !currentUser) return;
    try {
        var result = await supabase.from('routines')
            .upsert({
                user_id: currentUser.id,
                routine_type: routineType,
                steps: steps,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id,routine_type' });
        if (result.error) throw result.error;
        showShareToast('Routine saved! 루틴이 저장되었습니다!');
    } catch (e) {
        console.error('Save routine error:', e);
        showShareToast('Failed to save routine. 루틴 저장에 실패했습니다.');
    }
}

async function loadRoutines() {
    if (!supabase || !currentUser) return [];
    try {
        var result = await supabase.from('routines')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('routine_type');
        if (result.error) throw result.error;
        return result.data || [];
    } catch (e) {
        console.error('Load routines error:', e);
        return [];
    }
}

// ===== Account =====

async function deleteAllUserData() {
    if (!supabase || !currentUser) return;
    try {
        // Delete in order: diary, routines, analysis_results, then profile
        await supabase.from('skin_diary').delete().eq('user_id', currentUser.id);
        await supabase.from('routines').delete().eq('user_id', currentUser.id);
        await supabase.from('analysis_results').delete().eq('id', currentUser.id);
        await supabase.from('profiles').delete().eq('id', currentUser.id);
        showShareToast('All data deleted. 모든 데이터가 삭제되었습니다.');
        await logout();
    } catch (e) {
        console.error('Delete all data error:', e);
        showShareToast('Failed to delete data. 데이터 삭제에 실패했습니다.');
    }
}
