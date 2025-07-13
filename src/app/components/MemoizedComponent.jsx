"use client";
import React, { memo } from 'react';

const MemoizedComponent = memo(({ children, ...props }) => {
  return React.cloneElement(children, props);
});

MemoizedComponent.displayName = 'MemoizedComponent';

export default MemoizedComponent; 