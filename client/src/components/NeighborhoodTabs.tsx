import React from 'react';
import { Link } from 'react-router-dom';
import CreatePartyPopup from './CreatePartyPopup';

const Tab = ({
  tab, openTab, setOpenTab, name, color
}: any) => {
  // const color = 'caviar';
  return (
    <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
      <a
        className={
          `text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
            openTab === tab
              ? `text-white bg-${color}`
              : `text-${color} bg-white`}`
        }
        onClick={e => {
          e.preventDefault();
          setOpenTab(tab);
        }}
        data-toggle="tab"
        href={`#link${tab}`}
        role="tablist"
      >
        {name}
      </a>
    </li>
  );
};

const TabContent = ({ parties, user }: any) => {
  return (
    <>
      {/* Start a Party Section */}
      {parties && (
        <div className="flex flex-row flex-wrap">
          <div className="relative flex justify-center px-8 py-10">
            <svg className="h-house w-house fill-current text-seaweed" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
            </svg>
            <p className="absolute top-1/2 left-auto font-bold text-white text-xl">NEW</p>
            <h4 className="absolute bottom-0 left-auto">
              <CreatePartyPopup
                user={user}
              />
            </h4>
          </div>

          {/* TabContent Section by Type */}
          {parties.map((party: any) => {
            let houseColor = party.inviteOnly ? 'salmon' : 'avocado';
            if (party.inviteStatus === 'pending') houseColor = 'caviar';

            return (
              <div key={party.name} className="relative flex justify-center px-8 py-10">
                <svg className={`h-house w-house fill-current text-${houseColor}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path xmlns="http://www.w3.org/2000/svg" d="M8 20H3V10H0L10 0l10 10h-3v10h-5v-6H8v6z" />
                </svg>
                <h4 className="absolute bottom-0 left-auto">
                  <Link to={`/partyProfile/${party.id}`}>
                    <button type="button" className="bg-white hover:text-salmon text-gray-800 py-1 px-2 font-semibold border border-gray-400 rounded-full shadow">
                      {party.name}
                    </button>
                  </Link>
                </h4>

              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const NeighborhoodTabs = ({ parties, user }: any) => {
  const [openTab, setOpenTab] = React.useState(1);

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
            <Tab tab={1} openTab={openTab} setOpenTab={setOpenTab} name="All" color="seaweed" />
            <Tab tab={2} openTab={openTab} setOpenTab={setOpenTab} name="Public" color="avocado" />
            <Tab tab={3} openTab={openTab} setOpenTab={setOpenTab} name="Private" color="salmon" />
            <Tab tab={4} openTab={openTab} setOpenTab={setOpenTab} name="Invites" color="caviar" />
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? 'block' : 'hidden'} id="link1">
                  <TabContent parties={parties} user={user} />
                </div>
                <div className={openTab === 2 ? 'block' : 'hidden'} id="link2">
                  <TabContent parties={parties.filter((party: any) => party.inviteOnly === false)} user={user} />
                </div>
                <div className={openTab === 3 ? 'block' : 'hidden'} id="link3">
                  <TabContent parties={parties.filter((party: any) => party.inviteOnly === true)} user={user} />
                </div>
                <div className={openTab === 4 ? 'block' : 'hidden'} id="link4">
                  <TabContent parties={parties.filter((party: any) => party.inviteOnly === true && party.inviteStatus === 'pending')} user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NeighborhoodTabs;
