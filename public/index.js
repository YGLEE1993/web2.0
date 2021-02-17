function App() {
    const [totalAmount, setTotalAmount] = React.useState("1000");
    const [amount, setAmount] = React.useState('100');
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
    // <div className="App">
    //     <h1>Web3.0 Lottery App</h1>
    //     <p>Total lottery amount is {totalAmount} </p>
    //     <form onSubmit={onSubmit}>
    //         <input placeholder="amount" value={amount} onChange = {(e) => setAmount(e.target.value)}/>
    //         <input placeholder="email" value={email} onChange = {(e) => setEmail(e.target.value)} />
    //         <button type="submit">Participate</button>
    //     </form>
    // </div>
    <div className="container">
            <div className="col-md-12">
              <div className="card text-center">
                  <div className="card-header">
                    <h1>TOTAL WINNING POOL IS </h1>
                    <div className ="block">
                        <div className="circle">
                          <p>{totalAmount}</p>
                        </div>
                    </div>
                  </div>
                  <div className="card-body">
                  <form onSubmit={onSubmit}>
                      <div className="form-group">
                        <label >Email address</label>
                        <input type="email" className="form-control" placeholder="Enter email"
                          onChange = {(e) => setEmail(e.target.value)}
                        />
                        <small className="form-text text-muted">Well never share your email with anyone else.</small>
                      </div>
                      <div className="form-group">
                        <label>Amount</label>
                        <input type="number" className="form-control"  placeholder="Enter Amount"
                          value={amount}
                          onChange = {(e) => setAmount(e.target.value)}
                        />
                        <small className="form-text text-muted">Enter the amount you would like to participate with</small>
                      </div>
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                  </div>
              </div>
            </div>
        </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));


