import LoadingIcon from "/assets/icon-loading.gif"

const LoadingPage = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.5em' }}>
      <p>Loading, please wait...</p>
      <img src={LoadingIcon} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;