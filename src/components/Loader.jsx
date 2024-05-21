import icon from "../assets/icon_loading.png";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-64 flex-col">
      <div className="my-auto animate-pulse text-2xl">Loading...</div>
      <div className="h-24 w-24">
        <img src={icon} alt="Loading Icon" className=" animate-bounce" />
      </div>
    </div>
  );
};
export default Loader;
