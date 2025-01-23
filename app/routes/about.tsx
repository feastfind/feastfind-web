import SearchForm from '@/components/shared/SearchForm';
import type { Route } from './+types/about';
import { Link, useOutletContext } from 'react-router';
import teamData from '@/data/teamData';
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'About - FeastFind' },
    { name: 'description', content: 'Find feast closest to you!' },
  ];
}

export default function Route() {
  const searchFormStatus: boolean = useOutletContext();

  return (
    <div className="flex flex-col gap-4 p-5 mt-16">
      <h2 className="text-2xl font-medium dark:text-white">About Feastfind</h2>
      {searchFormStatus && <SearchForm />}
      <div className="flex flex-col gap-2 text-sm">
        <p>
          Kami engineer dan developer aplikasi FeastFind terdiri dari lima orang
          profesional memiliki kemampuan fullstack, menguasai frontend &
          backend. Setiap anggota tim berperan merancang, mengembangkan, dan
          memelihara aplikasi secara menyeluruh, menggunakan TypeScript sebagai
          bahasa pemrograman utama.
        </p>

        <p>
          Feastfind sendiri merupakan aplikasi yang dapat digunakan untuk
          mencari tempat kuliner. Pengguna dapat memberikan review dan rating
          pada menu-menu makanan yang ada. Selain itu, pengguna juga dapat
          memposting tempat kuliner seperti rumah makan atau restoren beserta
          menu-menu yang terdapat di dalamnya setelah register. Yuk gunakan
          Feastfind.com dan temukan tempat kuliner favoritmu.
        </p>
      </div>

      <h3 className="text-xl font-medium dark:text-white">
        Source Code on Github
      </h3>

      <div className="flex gap-2 text-sm items-center">
        <GitHubLogoIcon />
        <Link
          to="https://github.com/feastfind/"
          className="text-red-600 hover:text-red-800 transition-all"
          target="_blank"
        >
          Feastfind |
        </Link>
        <Link
          to="https://github.com/feastfind/feastfind-web"
          className="text-red-600 hover:text-red-800 transition-all"
          target="_blank"
        >
          Feastfind Web |
        </Link>
        <Link
          to="https://github.com/feastfind/feastfind-api"
          className="text-red-600 hover:text-red-800 transition-all"
          target="_blank"
        >
          Feastfind Api
        </Link>
      </div>

      <h3 className="text-xl font-medium dark:text-white">Feastfind Team</h3>

      <div>
        {teamData.map((team, index) => (
          <div
            className="flex gap-3 mb-3 p-3 border rounded-lg items-center"
            key={index}
          >
            <div className="w-1/5">
              <img src={team.photo} className="rounded-sm" />
            </div>

            <div>
              <div className="text-lg font-semibold text-red-700">
                {team.name}
              </div>
              <div className="text-sm flex items-center gap-2 text-slate-600">
                {team.position}
                <div className="flex gap-2">
                  <Link to={team.github} target="_blank">
                    <GitHubLogoIcon className="text-red-800 hover:text-slate-800" />
                  </Link>
                  <Link to={team.linkedin} target="_blank">
                    <LinkedInLogoIcon className="text-blue-800 hover:text-slate-800" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
