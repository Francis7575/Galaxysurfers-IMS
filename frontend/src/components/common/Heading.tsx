import BackBtn from '/assets/back-button.svg'

type UserHeading = {
  title: string
  showBackBtn?: boolean;
}

const Usertitle = ({ title, showBackBtn = true }: UserHeading) => {
  return (
    <div className="px-[40px] 930:px-0 w-full">
      <div className="pt-[25px] 930:text-left border-b border-lightgray pb-[17px]
          930:pl-[29px] 930:py-[30px] lg:py-[40px] 930:w-full 930:underline flex items-center 
          930:gap-[.35rem] w-full">
        {showBackBtn && (
          <button className='max-w-[18px] hover:opacity-50'>
            <img src={BackBtn} alt="Back button" />
          </button>
        )}
        <div className="flex-grow flex justify-center 930:justify-start">
          <h2 className="font-medium">
            {title}
          </h2>
        </div>
      </div>
    </div>
  )
}

export default Usertitle