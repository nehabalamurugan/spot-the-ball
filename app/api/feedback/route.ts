import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const { data: feedbackData, error } = await supabase
      .from('feedback')
      .insert([{
        user_id: data.userId,
        round_number: data.roundNumber,
        feedback_text: data.feedback
      }])
      .select()

    if (error) throw error
    
    return NextResponse.json(feedbackData)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
} 