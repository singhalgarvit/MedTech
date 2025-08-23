import {Link} from "react-router-dom";

function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center">Medtech</h1>
      <div className="text-gray-700 text-center underline">
        <Link className=" m-2" to="/login">Login</Link>
        <Link className="m-2" to="/signup">Signup</Link>
      </div>
    </div>
  );
}

export default Home;
