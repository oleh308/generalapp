import React, { useState } from 'react';
import Modal from '../components/blocks/Modal';

const ModelContext = React.createContext();

function ModelProvider({children}) {
  const [content, setContent] = useState(null)

  return (
    <ModelContext.Provider value={{ setContent: (content) => setContent(content) }}>
      {children}
      {content && <Modal clear={() => setContent(null)}>{content}</Modal>}
    </ModelContext.Provider>
  )
}

export {
  ModelContext,
  ModelProvider
}
