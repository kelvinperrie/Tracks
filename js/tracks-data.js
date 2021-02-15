var gameData = {
    tileCountInWidth : 6,
    tileCountInHeight : 5,
    tiles : [
        {
            x: 2,
            y: 1,
            id: "0 0",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 2,
            y: 3,
            id: "wow",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "right",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 2,
            y: 2,
            id: "hi",
            connections: [
                { 
                    side1: "bottom",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 1,
            id: "hi3",
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 2,
            id: "hi2",
            connections: [
                { 
                    side1: "right",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 3,
            id: "hi1",
            isMoveable: false,
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        }
    ]
};