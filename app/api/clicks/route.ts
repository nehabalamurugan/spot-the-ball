import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const data = await request.json()
  
  try {
    const { data: clickData, error } = await supabase
      .from('clicks')
      .insert([{
        image_id: data.imageId,
        user_id: data.userId,
        click_x: data.clickX,
        click_y: data.clickY,
        actual_x: data.actualX,
        actual_y: data.actualY,
        score: data.score,
        distance: data.distance
      }])
      .select()

    if (error) throw error
    
    return NextResponse.json(clickData)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to save click data' }, { status: 500 })
  }
}