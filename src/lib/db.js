import { supabase } from './supabase'

// ===== Analysis Results =====

export async function savePersonalColorResult(userId, analysis) {
  const { error } = await supabase.from('analysis_results').upsert({
    id: userId,
    pc_type: analysis.type,
    pc_confidence: analysis.confidence,
    pc_warmth: analysis.warmth,
    pc_depth: analysis.depth,
    pc_clarity: analysis.clarity,
    pc_skin_rgb: analysis.skinRgb,
    pc_scores: analysis.scores,
    pc_analyzed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function saveFaceShapeResult(userId, shapeResult) {
  const { error } = await supabase.from('analysis_results').upsert({
    id: userId,
    fs_shape: shapeResult.shape,
    fs_confidence: shapeResult.confidence,
    fs_scores: shapeResult.scores,
    fs_analyzed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function saveSkinResult(userId, skinScores, overallScore) {
  const { error } = await supabase.from('analysis_results').upsert({
    id: userId,
    skin_redness: skinScores.redness,
    skin_oiliness: skinScores.oiliness,
    skin_dryness: skinScores.dryness,
    skin_dark_spots: skinScores.darkSpots,
    skin_texture: skinScores.texture,
    skin_overall_score: overallScore,
    skin_analyzed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function saveQuizResult(userId, skinType, season, quizScores) {
  const { error } = await supabase.from('analysis_results').upsert({
    id: userId,
    quiz_type: skinType,
    quiz_season: season,
    quiz_scores: quizScores,
    quiz_taken_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }, { onConflict: 'id' })
  if (error) throw error
}

export async function loadAnalysisResults(userId) {
  const { data, error } = await supabase.from('analysis_results')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data || null
}

// ===== Skin Diary =====

export async function saveDiaryEntry(userId, entry) {
  const data = {
    user_id: userId,
    entry_date: entry.entry_date,
    overall_condition: entry.overall_condition || null,
    sleep_hours: entry.sleep_hours || null,
    stress_level: entry.stress_level || null,
    water_intake: entry.water_intake || null,
    notes: entry.notes || null,
    updated_at: new Date().toISOString()
  }
  if (entry.ai_scores) {
    data.ai_redness = entry.ai_scores.redness
    data.ai_oiliness = entry.ai_scores.oiliness
    data.ai_dryness = entry.ai_scores.dryness
    data.ai_dark_spots = entry.ai_scores.darkSpots
    data.ai_texture = entry.ai_scores.texture
    data.ai_overall_score = entry.ai_scores.overallScore
  }
  const { error } = await supabase.from('skin_diary')
    .upsert(data, { onConflict: 'user_id,entry_date' })
  if (error) throw error
}

export async function loadDiaryEntries(userId, days = 14) {
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  const fromStr = fromDate.toISOString().split('T')[0]

  const { data, error } = await supabase.from('skin_diary')
    .select('*')
    .eq('user_id', userId)
    .gte('entry_date', fromStr)
    .order('entry_date', { ascending: false })
  if (error) throw error
  return data || []
}

export async function deleteDiaryEntry(userId, entryId) {
  const { error } = await supabase.from('skin_diary')
    .delete()
    .eq('id', entryId)
    .eq('user_id', userId)
  if (error) throw error
}

// ===== Routines =====

export async function saveRoutine(userId, routineType, steps) {
  const { error } = await supabase.from('routines')
    .upsert({
      user_id: userId,
      routine_type: routineType,
      steps: steps,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,routine_type' })
  if (error) throw error
}

export async function loadRoutines(userId) {
  const { data, error } = await supabase.from('routines')
    .select('*')
    .eq('user_id', userId)
    .order('routine_type')
  if (error) throw error
  return data || []
}

// ===== Account =====

export async function deleteAllUserData(userId) {
  await supabase.from('skin_diary').delete().eq('user_id', userId)
  await supabase.from('routines').delete().eq('user_id', userId)
  await supabase.from('analysis_results').delete().eq('id', userId)
  await supabase.from('profiles').delete().eq('id', userId)
}
