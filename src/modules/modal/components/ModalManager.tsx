import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlineClose } from 'react-icons/ai';

import Portal from '@/common/components/Portal';

import {
  bgAnimation,
  modalAnimation,
} from '../animations/ModalManager.animations';
import { modalContext } from '../context/modal.context';

const ModalManager = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [modal, setModal] = useState<JSX.Element | JSX.Element[] | null>(null);
  const [userClose, setUserClose] = useState(true);

  const [portalNode, setPortalNode] = useState<HTMLElement>();

  useEffect(() => {
    if (!portalNode) {
      const node = document.getElementById('portal');
      if (node) setPortalNode(node);
      return;
    }

    if (modal) {
      portalNode.style.pointerEvents = 'all';
    } else {
      portalNode.style.pointerEvents = 'none';
    }
  }, [modal, portalNode]);

  const openModal = (
    newModal: JSX.Element | JSX.Element[],
    userCloseArg = true
  ) => {
    setModal(newModal);
    setUserClose(userCloseArg);
  };

  const closeModal = () => {
    setModal(null);
  };

  return (
    <modalContext.Provider value={{ modal, openModal, closeModal }}>
      <Portal>
        <motion.div
          className="z-40 flex min-h-full w-full items-center justify-center bg-black/60 backdrop-blur-md"
          onClick={() => userClose && closeModal()}
          variants={bgAnimation}
          initial="closed"
          animate={modal ? 'opened' : 'closed'}
        >
          <AnimatePresence>
            {modal && (
              <motion.div
                variants={modalAnimation}
                initial="closed"
                animate="opened"
                exit="exited"
                onClick={(e) => e.stopPropagation()}
                className="relative flex w-full max-w-[20rem] flex-col items-center rounded-lg bg-zinc-900 p-6 sm:w-auto sm:min-w-[20rem] sm:max-w-none"
              >
                {userClose && (
                  <button
                    className="absolute right-1 top-1 rounded-lg p-2 text-lg transition-transform hover:scale-105 active:scale-100"
                    onClick={closeModal}
                  >
                    <AiOutlineClose />
                  </button>
                )}

                {modal}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Portal>
      {children}
    </modalContext.Provider>
  );
};

export default ModalManager;
