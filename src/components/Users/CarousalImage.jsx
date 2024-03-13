const CarousalImage = ({ src }) => {
    return (
        <>
            <div>
                <img style={{ height: "80vh" }}
                    className="d-block w-100"
                    src={src}
                    alt="First slide"
                />
            </div>
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                }}>
            </div>
        </>
    );
};

export default CarousalImage;