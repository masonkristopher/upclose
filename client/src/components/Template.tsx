import React, { FC, ReactElement, useState, useEffect } from 'react';

interface TemplateProps {
  user: {
    id: number,
    nameFirst: string,
    nameLast: string,
    username: string,
    email: string,
    avatar: string,
    googleId: string,
  };
}

const Template: FC<TemplateProps> = ({
  user,
}): ReactElement => {
  const [example, setExample] = useState();

  useEffect(() => {
  });

  return (
    <div className="">
      {user}
    </div>
  );
};

export default Template;
