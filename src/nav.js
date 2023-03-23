import { Link } from 'react-router-dom';
const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><Link to='/exam'>Exams</Link></li>
                <li><Link to='/forum'>Forum</Link></li>
                <li><Link to='/account'>Account</Link></li>
                <li><Link to='/createExam'>Create Exam</Link></li>
            </ul>
        </nav >

    );
}

export default Navigation;
