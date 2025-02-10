import LoadingIcon from "/assets/icon-loading.gif"

const LoadingPage = () => {
  return (
    <div className="text-[1.5em] flex flex-col justify-center items-center min-h-screen">
      <p className="mb-10">Loading, please wait...</p>
      <img src={LoadingIcon} alt="Loading..." className="w-[80px]"/>
    </div>
  );
};

export default LoadingPage;