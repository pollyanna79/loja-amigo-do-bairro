import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdvtuvohucyndqjnfpyh.supabase.co'
const supabaseKey = 'sb_publishable_WUIsSwuV_kncGM-YfnT0EA_gnQlS_D3'

export const supabase = createClient(supabaseUrl, supabaseKey)