function App() {
    const [totalAmount, setTotalAmount] = React.useState("1000")
  return (
    <div className="App">
        <h1>Web3.0 Lottery App</h1>
        <p>Total lottery amount is {totalAmount} </p>
        <form>
            <input placeholder="amount"/>
            <input placeholder="email"/>
            <button>Participate</button>
        </form>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));


