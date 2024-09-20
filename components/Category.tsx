import { topCategoryStyles } from "@/constants";
import Image from "next/image";
import React from "react";
import { Progress } from "./ui/progress";

const Category = ({ category }: CategoryProps) => {
  const { bg, circleBg, icon, progress, text } = topCategoryStyles[category.name as keyof typeof topCategoryStyles] || topCategoryStyles.default;

  return (
    <div className={`flex gap-[18px] justify-center items-center rounded-lg p-4 ${bg}`}>
      <div className={`${circleBg} size-10 rounded-full p-2 text-${progress.indicator}`}>
        <Image src={icon} height={20} width={20} alt="category icon" />
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between text-sm">
          <h4 className={`font-medium ${text.main}`}>{category.name}</h4>
          <p className={`font-normal ${text.count}`}>{category.count} times</p>
        </div>

        <Progress value={category.count} max={15} indicatorColor={progress.indicator} className={`${progress.bg}`} />
      </div>
    </div>
  );
};

export default Category;
