// ============================================
// Map Definitions (Fixed - Better layout for navigation)
// ============================================

const Maps = {
    // Scene: 聖心大樓 4F 教室 (Starting Point)
    classroom_4f: {
        id: 'classroom_4f',
        name: '聖心大樓 4F 教室',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 6 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [
            { x: 2, y: 8, type: 'item', itemId: 'burning_broom', icon: '🧹', message: '發現了一把燃燒的掃把！', oneTime: true, flag: 'broom_found' }
        ],
        triggers: [
            { x: 13, y: 10, type: 'door', targetMap: 'hallway_4f', targetX: 10, targetY: 5, message: '要離開教室嗎？', icon: '🚪' }
        ],
        npcs: [
            {
                x: 14, y: 2,
                id: 'lin_oo',
                name: '林OO',
                icon: '👨‍🦲',
                dialogue: ['嘿...', '你想要這個嗎？', '這可是很稀有的喔...'],
                giveHair: true
            }
        ]
    },

    // Scene: 聖心大樓 4F 走廊 (Horizontal strip layout)
    hallway_4f: {
        id: 'hallway_4f',
        name: '聖心大樓 4F 走廊',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 5 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 4, y: 5, type: 'door', targetMap: 'classroom_4f', targetX: 12, targetY: 10, message: '回到教室？', icon: '🚪' },
            { x: 14, y: 5, type: 'door', targetMap: 'bathroom_4f', targetX: 14, targetY: 5, message: '進入廁所？', icon: '🚻' },
            { x: 1, y: 5, type: 'stairs', targetMap: 'stairs_4f_3f', targetX: 8, targetY: 2, message: '下樓到3F？', icon: '⬇️' }
        ],
        npcs: [
            {
                x: 8, y: 5,
                id: 'student1',
                name: '季昇瑜',
                icon: '👨‍🎓',
                dialogue: ['嘿！我找到了一些有趣的東西...', '這是我在教室裡發現的魔法石碎片！', '你要的話可以給你！'],
                giveFragment: true
            }
        ],
        enemies: []
    },

    // Scene: 聖心大樓 4F 廁所 (Ghost blocks key room door)
    bathroom_4f: {
        id: 'bathroom_4f',
        name: '聖心大樓 4F 廁所',
        width: 16,
        height: 12,
        playerSpawn: { x: 14, y: 5 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 10, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [
            { x: 2, y: 2, type: 'locker', itemId: 'key', icon: '🗄️', message: '在置物櫃裡發現了一把鑰匙！', oneTime: true, flag: 'key_found' }
        ],
        triggers: [
            { x: 14, y: 5, type: 'door', targetMap: 'hallway_4f', targetX: 13, targetY: 5, message: '離開廁所？', icon: '🚪' }
        ],
        npcs: [],
        enemies: [
            // Ghost blocks the entrance to the key room (left upper room)
            { x: 3, y: 4, enemyId: 'enemy_1', oneTime: true, flag: 'bathroom_enemy_defeated' }
        ]
    },


    // Scene: 聖心大樓 4F到3F 樓梯
    stairs_4f_3f: {
        id: 'stairs_4f_3f',
        name: '聖心大樓 4F-3F 樓梯',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 2 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 8, y: 1, type: 'stairs', targetMap: 'hallway_4f', targetX: 2, targetY: 5, message: '上樓回4F？', icon: '⬆️' },
            { x: 8, y: 10, type: 'stairs', targetMap: 'hallway_3f', targetX: 2, targetY: 5, message: '下樓到3F？', icon: '⬇️' }
        ],
        npcs: [],
        enemies: []
    },

    // Scene: 聖心大樓 3F 教室
    classroom_3f: {
        id: 'classroom_3f',
        name: '聖心大樓 3F 教室',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 6 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 8, 9, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 13, y: 10, type: 'door', targetMap: 'hallway_3f', targetX: 4, targetY: 5, message: '要離開教室嗎？', icon: '🚪' }
        ],
        npcs: [
            {
                x: 14, y: 2,
                id: 'he_shengliang',
                name: '何昇諒',
                icon: '👨‍🏫',
                dialogue: ['哼...看你的身手，似乎還太嫩了。', '想挑戰我的智慧嗎？', '如果準備好的話，就來找我吧。'],
                testMaster: true
            }
        ]
    },

    // Scene: 聖心大樓 3F 廁所
    bathroom_3f: {
        id: 'bathroom_3f',
        name: '聖心大樓 3F 廁所',
        width: 16,
        height: 12,
        playerSpawn: { x: 14, y: 5 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 10, 10, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [
            { x: 2, y: 2, type: 'locker', itemId: 'coward_textbook', icon: '🗄️', message: '在置物櫃裡發現了懦夫講義！', oneTime: true, flag: 'coward_textbook_found' },
            { x: 3, y: 2, type: 'locker', itemId: 'buckyball', icon: '🗄️', message: '在置物櫃裡發現了巴克球！', oneTime: true, flag: 'buckyball_found' }
        ],
        triggers: [
            { x: 14, y: 5, type: 'door', targetMap: 'hallway_3f', targetX: 11, targetY: 5, message: '離開廁所？', icon: '🚪' }
        ],
        npcs: [],
        enemies: []
    },

    // Scene: 聖心大樓 3F 走廊
    hallway_3f: {
        id: 'hallway_3f',
        name: '聖心大樓 3F 走廊',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 5 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 1, y: 5, type: 'stairs', targetMap: 'stairs_4f_3f', targetX: 8, targetY: 9, message: '上樓到4F？', icon: '⬆️' },
            { x: 4, y: 5, type: 'door', targetMap: 'classroom_3f', targetX: 13, targetY: 10, message: '進入教室？', icon: '🚪' },
            { x: 11, y: 5, type: 'door', targetMap: 'bathroom_3f', targetX: 14, targetY: 5, message: '進入廁所？', icon: '🚻' },
            { x: 14, y: 5, type: 'stairs', targetMap: 'stairs_shengxin', targetX: 8, targetY: 2, message: '下樓到1F？', icon: '⬇️' }
        ],
        npcs: [
            {
                x: 8, y: 5,
                id: 'sifu_qiang',
                name: '斯賦薔',
                icon: '👨‍🏫',
                dialogue: ['同學懦夫講義有沒有倒背如流啊？(帶有鼻音)', '記住熟讀懦夫講義，學測輕鬆頂標喔！', '什麼!? 你還沒有懦夫講義? 廁所裡有發剩的！']
            }
        ],
        enemies: []
    },

    // Scene: 聖心大樓 樓梯 (3F到室外)
    stairs_shengxin: {
        id: 'stairs_shengxin',
        name: '聖心大樓 1F 樓梯',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 2 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [
            { x: 7, y: 5, type: 'item', itemId: 'fragment', icon: '📜', message: '在樓梯間發現了魔法石碎片！', oneTime: true, flag: 'fragment_stairs1' }
        ],
        triggers: [
            { x: 8, y: 1, type: 'stairs', targetMap: 'hallway_3f', targetX: 13, targetY: 5, message: '上樓回3F？', icon: '⬆️' },
            { x: 8, y: 10, type: 'stairs', targetMap: 'campus_outdoor', targetX: 4, targetY: 4, message: '前往室外？', icon: '🚪' }
        ],
        npcs: [],
        enemies: [
            { x: 8, y: 9, enemyId: 'enemy_2', oneTime: true, flag: 'stair_guard_defeated' }
        ]
    },

    // Scene: 室外校園 (Fixed - buildings have entrances)
    campus_outdoor: {
        id: 'campus_outdoor',
        name: '室外校園',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 6 },
        tiles: [
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 7, 18, 18, 18, 7, 7, 7, 7, 7, 19, 19, 19, 7, 7, 6],
            [6, 7, 18, 18, 18, 7, 7, 7, 7, 7, 19, 19, 19, 7, 7, 6],
            [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 7, 7, 7, 7, 7, 13, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6],
            [6, 11, 7, 7, 7, 12, 7, 7, 7, 7, 12, 7, 7, 7, 7, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6]
        ],
        objects: [
            { x: 1, y: 9, type: 'item', itemId: 'fragment', icon: '📜', message: '在樹後發現了魔法石碎片！', oneTime: true, flag: 'fragment_outdoor1' },
            { x: 10, y: 9, type: 'item', itemId: 'fragment', icon: '📜', message: '在長椅旁發現了魔法石碎片！', oneTime: true, flag: 'fragment_outdoor3' },
            { x: 8, y: 5, type: 'item', itemId: 'fragment', icon: '📜', message: '在路中央發現了魔法石碎片！', oneTime: true, flag: 'fragment_center' },
            { x: 14, y: 1, type: 'bird_tree', icon: '🌳', message: '這是一棵茂密的樹...' }
        ],
        triggers: [
            { x: 3, y: 4, type: 'door', targetMap: 'stairs_shengxin', targetX: 8, targetY: 9, message: '進入聖心大樓？', icon: '🏢' },
            { x: 11, y: 4, type: 'door', targetMap: 'stairs_huiqing', targetX: 8, targetY: 9, message: '進入會卿大樓？', icon: '🏢' },
            { x: 8, y: 8, type: 'sewer', targetMap: 'sewer_hidden', targetX: 8, targetY: 2, message: '這裡有個水溝蓋...', icon: '🕳️', needsFlag: 'fragment_count_5' }
        ],
        npcs: [
            { x: 6, y: 6, id: 'statue', name: '聖母像', icon: '🙏', dialogue: ['聖母亭...感覺很寧靜。', '願你的旅途平安。'], heal: true },
            { x: 14, y: 9, id: 'mimic', name: '寶箱', icon: '📦' }
        ]
    },

    // Scene: 會卿大樓 樓梯
    stairs_huiqing: {
        id: 'stairs_huiqing',
        name: '會卿大樓 樓梯',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 9 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 8, y: 10, type: 'door', targetMap: 'campus_outdoor', targetX: 11, targetY: 5, message: '離開會卿大樓？', icon: '🚪' },
            { x: 8, y: 1, type: 'locked_door', targetMap: 'rooftop', targetX: 8, targetY: 10, message: '前往屋頂？', needsItem: 'key', locked_message: '門是鎖著的...需要鑰匙。', icon: '🔒' }
        ],
        npcs: [],
        enemies: [
            // Guard blocks the entire row - must defeat to pass
            { x: 6, y: 5, enemyId: 'enemy_3', oneTime: true, flag: 'huiqing_enemy_defeated' },
            { x: 7, y: 5, enemyId: 'enemy_3', oneTime: true, flag: 'huiqing_enemy_defeated' },
            { x: 8, y: 5, enemyId: 'enemy_3', oneTime: true, flag: 'huiqing_enemy_defeated' },
            { x: 9, y: 5, enemyId: 'enemy_3', oneTime: true, flag: 'huiqing_enemy_defeated' },
            { x: 10, y: 5, enemyId: 'enemy_3', oneTime: true, flag: 'huiqing_enemy_defeated' }
        ]
    },

    // Scene: 會卿大樓 屋頂 (with blocking boss)
    rooftop: {
        id: 'rooftop',
        name: '會卿大樓 屋頂',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 10 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 17, 17, 0, 0, 0, 0, 0, 0, 0], // 2x2 Cross top
            [0, 0, 0, 0, 0, 0, 0, 17, 17, 0, 0, 0, 0, 0, 0, 0], // 2x2 Cross bottom
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 7, y: 3, type: 'ending', message: '終於到達了十字架！', icon: '✝️' },
            { x: 8, y: 3, type: 'ending', message: '終於到達了十字架！', icon: '✝️' },
            { x: 8, y: 10, type: 'door', targetMap: 'stairs_huiqing', targetX: 8, targetY: 2, message: '下樓？', icon: '⬇️' }
        ],
        npcs: [],
        enemies: [
            // Boss blocks the entire row - must defeat to pass
            { x: 6, y: 5, enemyId: 'boss_rooftop', oneTime: true, flag: 'rooftop_boss_defeated' },
            { x: 7, y: 5, enemyId: 'boss_rooftop', oneTime: true, flag: 'rooftop_boss_defeated' },
            { x: 8, y: 5, enemyId: 'boss_rooftop', oneTime: true, flag: 'rooftop_boss_defeated' },
            { x: 9, y: 5, enemyId: 'boss_rooftop', oneTime: true, flag: 'rooftop_boss_defeated' }
        ],
        isFinalArea: true
    },

    // Scene: 隱藏場景 - 下水道 (with blocking boss 姍姍)
    sewer_hidden: {
        id: 'sewer_hidden',
        name: '神秘下水道',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 10 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1],
            [1, 5, 5, 5, 5, 5, 0, 0, 0, 0, 5, 5, 5, 5, 5, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [
            { x: 4, y: 3, type: 'item', itemId: 'easter_egg', icon: '🥚', message: '在下水道深處發現了隱藏的彩蛋！', oneTime: true, flag: 'easter_sewer' }
        ],
        triggers: [
            { x: 8, y: 1, type: 'door', targetMap: 'campus_outdoor', targetX: 8, targetY: 7, message: '回到地面？', icon: '⬆️' },
            { x: 8, y: 10, type: 'door', targetMap: 'sewer_deeper', targetX: 8, targetY: 2, message: '進入深處？', icon: '🕳️' }
        ],
        npcs: [],
        enemies: [
            // Boss 姍姍 blocks the row - must defeat to reach the fragment
            { x: 6, y: 5, enemyId: 'boss_shanshan', oneTime: true, flag: 'boss_defeated' },
            { x: 7, y: 5, enemyId: 'boss_shanshan', oneTime: true, flag: 'boss_defeated' },
            { x: 8, y: 5, enemyId: 'boss_shanshan', oneTime: true, flag: 'boss_defeated' },
            { x: 9, y: 5, enemyId: 'boss_shanshan', oneTime: true, flag: 'boss_defeated' }
        ],
        isHidden: true
    },

    // Scene: 下水道深處 (True Secret Area)
    sewer_deeper: {
        id: 'sewer_deeper',
        name: '下水道深處',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 2 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        objects: [],
        triggers: [
            { x: 8, y: 1, type: 'door', targetMap: 'sewer_hidden', targetX: 8, targetY: 9, message: '返回上層？', icon: '⬆️' },
            { x: 8, y: 10, type: 'door', targetMap: 'sewage_palace', targetX: 8, targetY: 10, message: '進入汙水之殿？', icon: '☠️' }
        ],
        npcs: [],
        enemies: [],
        isHidden: true
    },

    // Scene: 汙水之殿 (Boss Area)
    sewage_palace: {
        id: 'sewage_palace',
        name: '汙水之殿',
        width: 16,
        height: 12,
        playerSpawn: { x: 8, y: 10 },
        tiles: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 5, 5, 1], // Path to throne
            [1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 1], // Open space around throne
            [1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 1], // Boss area top
            [1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 1], // Boss area mid
            [1, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 1], // Boss area bot
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1]  // Exit at (8, 11)
        ],
        objects: [],
        triggers: [
            { x: 8, y: 11, type: 'door', targetMap: 'sewer_deeper', targetX: 8, targetY: 9, message: '離開汙水之殿？', icon: '⬇️' },
            { x: 8, y: 2, type: 'ending', message: '坐上汙水王座...', icon: '👑', needsFlag: 'octopus_defeated' }
        ],
        npcs: [],
        enemies: [
            // Boss blocks the entire row (x=5 to 11) at y=5
            { x: 5, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 6, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 7, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 8, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 9, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 10, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' },
            { x: 11, y: 5, enemyId: 'boss_octopus', oneTime: true, flag: 'octopus_defeated' }
        ],
        isHidden: true
    }
};

// Get map by ID
function getMap(mapId) {
    return Maps[mapId] || null;
}

// Get all map IDs
function getAllMapIds() {
    return Object.keys(Maps);
}
