import Home from "./components/Home";

const App = () => {
  return (
    <div className=" bg-[url('https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-auto min-h-[100vh] w-[100vw] grid items-center relative">
      <div className="absolute inset-0 bg-black opacity-70"></div>
      <Home />
    </div>
  );
};

export default App;
