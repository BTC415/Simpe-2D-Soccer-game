import Link from 'next/link';

import { useModal } from '@/modules/modal';

const Error = () => {
  const { closeModal } = useModal();

  return (
    <div className="text-center">
      <p className="text-lg">Error in connecting</p>
      <p className="text-sm text-zinc-400">Try different browser</p>
      <Link href="/">
        <button
          className="btn mt-3 from-zinc-700 to-zinc-500"
          onClick={closeModal}
        >
          Leave
        </button>
      </Link>
    </div>
  );
};

export default Error;
