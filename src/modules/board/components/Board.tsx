import Background from './Background';
import Players from './Players';

const Board = () => {
  return (
    <div className="mt-5 flex w-full justify-center">
      <Players />
      <Background />
    </div>
  );
};

export default Board;
