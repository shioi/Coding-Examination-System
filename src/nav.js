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
            <ul>
                {user.isProf === 0 && <li><Link to='/'>Exams</Link></li>}
                <li><Link to='/account'>Account</Link></li>
                {user.isProf === 1 && <li><Link to='/createExam'>Create Exam</Link></li>}
            </ul>
            <div>
                {user && (
                    <Button variant="contained" onClick={handleClick}>Logout</Button>
                )}
            </div>
        </nav >

    );
}

export default Navigation;
