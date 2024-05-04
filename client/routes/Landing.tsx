import chat from "../assets/images/chat.svg";
import post from "../assets/images/post.svg";
import view from "../assets/images/view-photo.svg";
import logo from "../assets/images/logo_label.svg";
import { useState } from "react";

export default function Landing() {
  return (
    <div className="font-poppins bg-[#F1EFEE]">
      <Navbar />
      <Body />
      <Semifooter />
    </div>
  );
}

function Body() {
  return (
    <>
      <div className="m-10">
        <div className="flex flex-wrap">
          <div className="flex items-center justify-around sm:mx-10 lg:mx-24">
            <div className="flex-1 text-center font-semibold sm:text-2xl md:text-4xl lg:text-5xl">
              <p>
                Connect within the
                <p> Woodworking Community</p>
              </p>
              <p className="mt-10 text-center font-normal sm:text-xs md:text-sm lg:text-base">
                A central space for Woodworkers, Woodcrafters, and Woodworking
                Enthusiasts to engage and share knowledge. Helps the users to
                interact in real-time messaging and video calling, creating a
                supportive environment where users can learn from each other,
                build connections, and work on projects together.
              </p>
            </div>
            <div className="flex flex-1">
              <img src={chat} alt="" className="size-auto" />
            </div>
          </div>
          <div className="my-36">
            <div className="mx-24 mt-10 flex items-center justify-around">
              <div className="flex flex-1">
                <img src={view} alt="" className="size-auto" />
              </div>

              <div className="flex-1 text-center font-semibold md:text-4xl lg:text-5xl">
                <p>Share your expertise and works.</p>
                <p className="mt-10 text-center font-normal md:text-sm lg:text-base">
                  Designed to encourage members of woodworking community to
                  showcase their knowledge, skills, and projects. Aims to foster
                  a culture of knowledge sharing within the woodworking
                  community, allowing users to gain feedback, inspire others,
                  and establish themselves as skilled craftsmen.
                </p>
              </div>
            </div>
          </div>
          <div className="my-30">
            <div className="mx-24 mt-10 flex items-center justify-around">
              <div className="mr-24 flex-1 text-center font-semibold md:text-4xl lg:text-5xl">
                <p>Let's enhance your skills.</p>
                <p className="mt-10 text-center font-normal md:text-sm lg:text-base">
                  Provides users with resources and opportunities to improve
                  their woodworking skills. By encouraging skill enhancement, it
                  contributes to a more knowledgeable and competent community,
                  fostering both personal growth and a culture of continuous
                  improvement among woodworking enthusiasts.
                </p>
              </div>
              <div className="flex flex-1">
                <img src={post} alt="" className="size-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Semifooter() {
  return (
    <>
      <div className="m-10">
        <div className="item-center mt-32 flex justify-center">
          <img src={logo} alt="" className=" md:h-40 lg:h-64" />
        </div>
        <div className="mx-36 my-20 flex flex-wrap items-center justify-center">
          <div className="mx-20 flex-1">
            <p className="mb-5 text-center font-semibold md:text-xl lg:text-2xl">
              About UniWood
            </p>
            <p className="text-center md:text-xs lg:text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo
              eaque laboriosam fugiat repudiandae earum. Fuga assumenda
              consequuntur cupiditate minus quidem voluptate aliquam ea quam
              asperiores, placeat magnam, dolor, exercitationem corporis!
            </p>
          </div>
          <div className="mx-20 flex-1">
            <p className="mb-5 text-center font-semibold md:text-xl lg:text-2xl">
              What We Do
            </p>
            <p className=" text-center md:text-xs lg:text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore
              quo laboriosam deleniti, sequi expedita harum neque. Maxime
              nesciunt, assumenda obcaecati quo laboriosam delectus aperiam.
              Illo sequi eos temporibus quia magnam.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-center space-x-7 bg-secondary-400 p-10">
        <p className="text-center font-semibold md:text-xl lg:text-3xl">
          Register to learn and be more engage within the community.
        </p>
        <a
          href="#"
          className="md:text-md border-pr rounded-full border-2 px-5 py-2 lg:text-xl"
        >
          Register
        </a>
      </div>
    </>
  );
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleNavBar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3">
      <div className="container relative mx-auto">
        <div className="item-center mx-14 flex justify-between px-14">
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="logo"
              className="md:size-14sm:size-8 lg:size-36"
            />
          </div>
          <div className="item-center sm: mx-10 flex flex flex-wrap space-x-10">
            <a
              href="#"
              className="outline-primary mb-24 mt-3 rounded-md px-7 py-2 outline outline-2 sm:text-xs lg:text-base"
            >
              Sign
            </a>
            <a
              href="#"
              className="to-fourth text-tertiary mb-24 mt-3 rounded-md bg-gradient-to-r from-primary-400 px-7 py-2 sm:text-xs lg:text-base"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
