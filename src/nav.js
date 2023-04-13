import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useLogout } from './useLogout';
import { useAuthContext } from './useAuthContext';

const Navigation = () => {
    const { logout } = useLogout();
    const { user } = useAuthContext()
    const handleClick = () => {
        logout()
    }

    return (
        <nav>
            {user.isProf === 0 && <div>
                <ul>
                    <li><Link to='/'>Upcoming Exams</Link></li>
                    <li><Link to='/account'>Account</Link></li>
                    <li><Link to='/ongoingexam'>Ongoing Exams</Link></li>
                    <li><Link to='/pastexam'>Past Exams</Link></li>
                </ul>
            </div>
            }
            <div>
                {user && !user.isProf && (
                    <Button variant="contained" onClick={handleClick}>Logout</Button>

                )}
            </div>
        </nav >

    );
}

export default Navigation;


