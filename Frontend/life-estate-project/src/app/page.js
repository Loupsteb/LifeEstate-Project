"use client";
import Image from "next/image";
import Logo from "../../media/logo.png";

export default function Home() {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <Image
          src={Logo}
          alt="logo_LifeEstate"
          style={{ width: "auto", height: "auto" }}
          className="mt-5 rounded shadow-lg "
        />
      </div>
      <div>
        <h2>Life Estate, qui sommes nous ?</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quae
          voluptatum voluptatibus, quia, voluptatem, quibusdam quos voluptas
          quod doloribus exercitationem quas. Quisquam quae voluptatum
          voluptatibus, quia, voluptatem, quibusdam quos voluptas quod doloribus
          exercitationem quas. Quisquam quae
        </p>
        <h2>Notre équipe</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quae
          voluptatum voluptatibus, quia, voluptatem, quibusdam quos voluptas
          quod doloribus exercitationem quas. Quisquam quae voluptatum
          voluptatibus, quia, voluptatem, quibusdam quos voluptas quod doloribus
          exercitationem
        </p>
        <h2>Notre mission</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quae
          voluptatum voluptatibus, quia, voluptatem, quibusdam quos voluptas
          quod doloribus exercitationem quas. Quisquam quae voluptatum
          voluptatibus, quia, voluptatem, quibusdam quos voluptas quod doloribus
          exercitationem
        </p>
      </div>
    </div>
  );
}
