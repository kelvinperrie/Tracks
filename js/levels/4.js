var level4 = {
    level: 4,
    title : "Multitrack drift",
    tileCountInWidth : 6,
    tileCountInHeight : 5,
    trains: [
        {
            startTileId: 1
        },
        {
            startTileId: 2
        }
    ],
    tiles : [
        {
            x: 1,
            y: 1,
            id: 1,
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
            x: 2,
            y: 1,
            id: 2,
            connections: [
                { 
                    trackType: 2,
                    side1: "bottom",
                    fromEdge1: 50,
                    side2: "right",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 1,
            id: 3,
            connections: [
                { 
                    trackType: 2,
                    side1: "right",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 1,
            y: 2,
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
            x: 2,
            y: 2,
            id: 5,
            connections: [
                { 
                    trackType: 2,
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
            id: 6,
            connections: [
                { 
                    trackType: 2,
                    side1: "bottom",
                    fromEdge1: 50,
                    side2: "top",
                    fromEdge2: 50
                },
                { 
                    side1: "right",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 4,
            y: 2,
            id: 7,
            connections: [
                { 
                    side1: "left",
                    fromEdge1: 50,
                    side2: "right",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 1,
            y: 3,
            id: 8,
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
            id: 9,
            connections: [
                { 
                    trackType: 2,
                    side1: "right",
                    fromEdge1: 50,
                    side2: "top",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 3,
            id: 10,
            isMoveable: false,
            connections: [
                { 
                    side1: "left",
                    fromEdge1: 50,
                    side2: "top",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 4,
            y: 3,
            id: 11,
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
            x: 2,
            y: 4,
            id: 12,
            connections: [
                { 
                    trackType: 2,
                    side1: "top",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 3,
            y: 4,
            id: 13,
            connections: [
                { 
                    trackType: 2,
                    side1: "right",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                },
                { 
                    side1: "top",
                    fromEdge1: 50,
                    side2: "bottom",
                    fromEdge2: 50
                }
            ]
        },
        {
            x: 4,
            y: 4,
            id: 14,
            connections: [
                { 
                    trackType: 2,
                    side1: "bottom",
                    fromEdge1: 50,
                    side2: "left",
                    fromEdge2: 50
                }
            ]
        }
    ]
};
