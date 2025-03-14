import PetList from '@/components/petUI/PetList'
import authOptions from '@/lib/auth/options'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'


export default async function Page() {

    const session = await getServerSession(authOptions)

    if (session) {
        const token = session.user.token
        const userId = session.user.id 

        return <PetList userId={userId} token={token}/>
    }
    
    redirect('/login')
}