// src/components/GradualSpacing.js
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styled from 'styled-components';

const Character = styled(motion.span)`
  display: inline-block;
  font-size: inherit;
  color: ${(props) => props.theme.colors.textPrimary};
`;

const GradualSpacing = ({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  },
  className,
}) => {
  return (
    <div className={`flex justify-center space-x-1 ${className}`}>
      <AnimatePresence>
        {text.split('').map((char, i) => (
          <Character
            key={i}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={framerProps}
            transition={{ duration, delay: i * delayMultiple }}
          >
            {char === ' ' ? <span>&nbsp;</span> : char}
          </Character>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GradualSpacing;
