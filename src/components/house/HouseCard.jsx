// src/components/house/HouseCard.jsx

import React from "react";
import styles from "./HouseCard.module.css";

const HouseCard = ({ house }) => {
  const { name, address, price, imageUrl } = house;

  return (
    <div className={styles.cardWrapper}>
      <img
        className={styles.cardImage}
        src={imageUrl || "https://via.placeholder.com/300x200"}
        alt={name}
      />
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{name}</h3>
        <p className={styles.cardAddress}>{address}</p>
        <p className={styles.cardPrice}>
          {price.toLocaleString("vi-VN")} VNĐ/tháng
        </p>
      </div>
    </div>
  );
};

export default HouseCard;
