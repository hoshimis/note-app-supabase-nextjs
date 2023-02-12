import { NextPage } from 'next'
import { DocumentTextIcon, LogoutIcon } from '@heroicons/react/solid'
import { GetStaticProps } from 'next'
import { supabase } from '../utils/supabase'
import { Layout } from '../components/Layout'
import { NoteForm } from '../components/NoteForm'
import { NoteItem } from '../components/NoteItem'
import { Note } from '../types/types'

// オンデマンドISR
// getStaticPropsでsupabaseからデータを取得する
export const getStaticProps: GetStaticProps = async () => {
  console.log('ISR Invoked - notes page')
  // supabaseからデータを取得(すべて)
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(`${error.message}: ${error.details}`)
  }
  return {
    props: { notes },
    // isrを有効にするにはrevalidateに整数値msが必要
    // すべてオンデマンドISRなのでfalseになる
    // SSGと同じになるけど、明示的に書いておく
    revalidate: false,
  }
}

type StaticProps = {
  notes: Note[]
}

const Notes: NextPage<StaticProps> = ({ notes }) => {
  const signOut = () => {
    supabase.auth.signOut()
  }
  return (
    <Layout title="Notes">
      <LogoutIcon
        className="mb-6 h-6 w-6 cursor-pointer text-blue-500"
        onClick={signOut}
      />
      <DocumentTextIcon className="h-8 w-8 text-blue-500" />
      {/* 取得したnotesを展開 */}
      <ul className="my-2">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            user_id={note.user_id}
          />
        ))}
        <NoteForm />
      </ul>
    </Layout>
  )
}

export default Notes
