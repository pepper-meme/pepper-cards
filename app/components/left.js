"use client"
import Image from "next/image"

export const Left = () => {
    return (
        <div className="wrapper__game__left">
        {/* <div className="wrapper__game__left__middle">
            <div className="wrapper__game__left__middle__bg">
            <div className="wrapper__game__left__middle__bg__label">
                graveyard
            </div>
            </div>
            <div className="wrapper__game__left__middle__bg">
            {[1, 2, 3].map((_, index) => (
                <Image
                key={index}
                className="absolute"
                style={{ top: `-${index * 8}px` }}
                src="/assets/card-back.png"
                alt={`Card back ${index + 1}`}
                width={173}
                height={127}
                />
            ))}
            <div className="wrapper__game__left__middle__bg__label">deck</div>
            </div>
        </div> */}
        </div>
    )
}
