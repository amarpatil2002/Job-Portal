import { useState } from 'react';

function BasicInfo() {
    const [summary, setSummary] = useState();
    const [image, setImage] = useState();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
        } catch (error) {}
    };

    return (
        <div>
            <h2>BasicInfo</h2>
            <form onSubmit={handleSubmit}>
                <input
                    className="border-2"
                    type="text"
                    value={summary}
                    onChange={() => setSummary(e.target.value)}
                />
                <input className="border-2" type="image" src="" alt="" />
                <button disabled={loading}>Edit</button>
            </form>
        </div>
    );
}

export default BasicInfo;
