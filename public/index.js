function App() {
  const [totalAmount, setTotalAmount] = React.useState("0");
  const [amount, setAmount] = React.useState("");
  const [email, setEmail] = React.useState("");

  React.useEffect(async () => {
    const result = await axios.get("get_total_amount");
    setTotalAmount(result.data["0"].total_amount);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/post_info", {
      amount: amount,
      email: email,
    });
    window.location.href = response.data;
  };

  return (
    <div className="container" style={{ width: "500px" }}>
      <div className="col-md-12">
        <nav
          class="navbar navbar-light rounded"
          style={{
            marginTop: "50px",
            border: "2px solid black",
            backgroundColor: "f5f7f7",
          }}
        >
          <a style={{ letterSpacing: "2px" }} class="navbar-brand" href="#">
            <img
              src="./project-bg.png"
              width="40"
              height="40"
              class="d-inline-block align-top"
              alt="lottery-logo"
            />{" "}
            Lottery 2.0
          </a>
        </nav>
        <div
          className="card text-center"
          style={{ backgroundColor: "#0e1117" }}
        >
          <div className="card-header">
            {/* <h1 className="lottery-pool" style={{ color: "white" }}>
              Total Pool{" "}
            </h1> */}
            <div className="block">
              <div className="circle">
                <p>${totalAmount}</p>
              </div>
              <p
                style={{
                  color: "white",
                  fontSize: "12px",
                  letterSpacing: "2px",
                }}
              >
                TOTAL POOL
              </p>
            </div>
          </div>
          <div className="card-body" style={{ backgroundColor: "white" }}>
            <form onSubmit={onSubmit}>
              <div className="form-group">
                <p
                  style={{
                    fontSize: "17px",
                    textAlign: "left",
                    // marginBottom: "3px",
                    margin: "3px",
                    fontWeight: "500",
                  }}
                >
                  Email address
                </p>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small
                  style={{ textAlign: "left", marginLeft: "5px" }}
                  className="form-text text-muted"
                >
                  We'll never share your email with anyone else.
                </small>
              </div>
              <div className="form-group">
                <p
                  style={{
                    fontSize: "17px",
                    textAlign: "left",
                    // marginBottom: "3px",
                    margin: "3px",
                    fontWeight: "500",
                  }}
                >
                  Amount
                </p>
                <input
                  type="number"
                  className="form-control"
                  placeholder="$100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <small className="form-text text-muted">
                  Enter the amount you would like to participate with.
                </small>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: "#426e99",
                  color: "white",
                  letterSpacing: "1px",
                  fontSize: "17px",
                }}
                className="btn btn-outline-dark"
              >
                PARTICIPATE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
