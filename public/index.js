function App() {
    const [totalAmount, setTotalAmount] = React.useState("1000");
    const [amount, setAmount] = React.useState('100');
    const [email, setEmail] = React.useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('/post_info', {
            amount: amount,
            email: email,
        })
        console.log(response)
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


