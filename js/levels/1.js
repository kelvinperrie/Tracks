var level1 = {
    level: 1,
    title : "Hello World",
    tileCountInWidth : 6,
    tileCountInHeight : 5,
    tiles : [
        {
            x: 2,
            y: 1,
            id: 1,
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
            id: 2,
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
            id: 3,
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
            id: 4,
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
            x: 3,
            y: 2,
            id: 5,
            connections: [
                { 
                    side1: "left",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 3,
            id: 6,
            isMoveable: false,
            connections: [
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 1,
            y: 2,
            id: 7,
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
            x: 1,
            y: 1,
            id: 8,
            connections: [
                { 
                    side1: "right",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        }
    ]
};
