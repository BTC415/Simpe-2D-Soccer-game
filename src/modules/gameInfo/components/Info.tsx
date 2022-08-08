import Link from 'next/link';

const Info = () => {
  return (
    <>
      <div className="mt-5 w-full text-center">
        <Link href="/">
          <a className="gradient bg-clip-text text-center text-3xl font-black text-transparent">
            BALLZONE
          </a>
        </Link>
      </div>
      <div className="flex w-full items-center justify-center gap-72 text-4xl">
        <p className="font-black text-blue-500">BLUE TEAM</p>

        <div className="flex items-center gap-10">
          <p className="text-6xl font-black text-blue-500">1</p>
          <p className="font-black">5:00</p>
          <p className="text-6xl font-black text-red-500">2</p>
        </div>

        <p className="text-4xl font-black text-red-500">RED TEAM</p>
      </div>
    </>
  );
};

export default Info;
