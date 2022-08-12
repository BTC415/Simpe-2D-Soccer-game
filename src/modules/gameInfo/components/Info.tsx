import { PLAYER_SIZE } from '@/common/constants/settings';

const Info = () => {
  return (
    <div
      className="absolute z-20 flex w-full items-center bg-black/40 backdrop-blur-sm"
      style={{ height: PLAYER_SIZE * 2 }}
    >
      <div className="flex w-full items-center justify-center gap-72 text-3xl">
        <p className="font-black text-blue-500">BLUE TEAM</p>

        <div className="flex items-center gap-10">
          <p className="text-5xl font-black text-blue-500">1</p>
          <p className="font-black">5:00</p>
          <p className="text-5xl font-black text-red-500">2</p>
        </div>

        <p className="text-3xl font-black text-red-500">RED TEAM</p>
      </div>
    </div>
  );
};

export default Info;
