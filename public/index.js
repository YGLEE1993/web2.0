function App() {
    const [totalAmount, setTotalAmount] = React.useState("1000");
    const [amount, setAmount] = React.useState('5000');
    const [email, setEmail] = React.useState('');

    React.useEffect(async () => {
        const result = await axios.get('get_total_amount');
        setTotalAmount(result.data["0"].total_amount)
    }, [])
    
    const onSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/post_info', {
            amount: amount,
            email: email,
        })
        window.location.href = response.data;
    }

  return (
    <div className="App">
        <h1>Web3.0 Lottery App</h1>
        <p>Total lottery amount is {totalAmount} </p>
        <form onSubmit={onSubmit}>
            <input placeholder="amount" value={amount} onChange = {(e) => setAmount(e.target.value)}/>
            <input placeholder="email" value={email} onChange = {(e) => setEmail(e.target.value)} />
            <button type="submit">Participate</button>
        </form>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));


