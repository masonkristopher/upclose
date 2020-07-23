import React, { FC, ReactElement } from 'react';
import Logo from './Logo';

interface LandingProps {
}

const Landing: FC<LandingProps> = (): ReactElement => {
  // const [example, setExample] = useState();

  // useEffect(() => {
  // });

  return (
    <div className="">
      <div className="">
        <Logo height={400} width={400} />
      </div>
      <p>
        {/* eslint-disable-next-line max-len */}
        UpClose is a revolutionary video conferencing application that creates realistic social environments through positionally adjusted audio streaming. Start a party, and hang out in one big house with all your friends, while only hearing the ones closest to you. Instead of straining to be heard, simply navigate to another room in the house with your conversation partners. UpClose is the answer to socio-virtual gatherings of all kinds. Whether you’re hanging with friends, hosting a networking event, or even teaching a classroom, UpClose is the tool to help you hear and be heard.
      </p>
    </div>
  );
};

export default Landing;
