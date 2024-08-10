import { useAuth } from "../contexts/Auth"
export default function Account() {
    const {user} = useAuth()
    return ( 
        <div>
            <h2>Account info</h2>
            { user && (
                <>
                    <p>Username - { user.username }</p>
                    <p>email - { user.email } </p>
                    <p>Role - { user.role }</p>  

                </>
            )}
        </div>
    )
}