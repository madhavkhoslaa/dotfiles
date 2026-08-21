import QtQuick 2.15

// Minimal SDDM greeter styled to match .config/hypr/hyprlock.conf: same
// background-image treatment, same clock/date layout, same pill-shaped
// outline fields with no fill. No SddmComponents dependency and no
// bundled widget images -- the only asset this theme ships is
// background.png, everything else is drawn with plain QtQuick shapes/text.

Rectangle {
    id: root
    width: 1280
    height: 800
    color: "black"

    property int sessionIndex: sessionModel.lastIndex
    property string sessionName: ""
    property string statusText: ""
    property color statusColor: "white"

    Image {
        id: bg
        anchors.fill: parent
        source: config.background
        fillMode: Image.PreserveAspectCrop
        asynchronous: true
        onStatusChanged: {
            if (status === Image.Error && source != config.defaultBackground) {
                source = config.defaultBackground
            }
        }
    }

    Timer {
        interval: 1000
        running: true
        repeat: true
        triggeredOnStart: true
        property date now: new Date()
        onTriggered: now = new Date()
        id: clockTick
    }

    Connections {
        target: sddm
        function onLoginSucceeded() {
            root.statusColor = "white"
            root.statusText = "Logging in..."
        }
        function onLoginFailed() {
            passwordInput.text = ""
            root.statusColor = "#ff8080"
            root.statusText = "Login failed"
        }
        function onInformationMessage(message) {
            root.statusColor = "#ff8080"
            root.statusText = message
        }
    }

    // pill outline matching hyprlock's input-field {} block: no fill,
    // 2px white-ish border, fully rounded
    component FieldFrame: Rectangle {
        implicitWidth: 260
        implicitHeight: 44
        radius: height / 2
        color: "#00000000"
        border.width: 2
        border.color: "#e5e5e5"
    }

    Column {
        anchors.centerIn: parent
        spacing: 22

        // TIME / DATE, same stack as the $TIME / date labels in hyprlock.conf
        Column {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 2

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: Qt.formatTime(clockTick.now, "hh:mm")
                font.family: "Iosevka"
                font.pixelSize: 64
                color: "white"
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: Qt.formatDate(clockTick.now, "dddd, dd MMMM yyyy")
                font.family: "CaskaydiaCove Nerd Font"
                font.pixelSize: 15
                color: "white"
            }
        }

        // USERNAME (editable + dropdown of known local users). Trigger row,
        // divider, and list all live inside ONE clip:true rounded Rectangle
        // ("card") -- that way the outer silhouette is perfectly rounded
        // with no seam gaps, without needing per-corner radius (which Qt5's
        // Rectangle doesn't have; sddm-greeter still ships a Qt5 build).
        // Colors match kitty's look (.config/kitty/kitty.conf background
        // #000000 + the opacity=0.7 window rule in rules.lua): black glass,
        // white text, not solid like the reference image.
        Item {
            anchors.horizontalCenter: parent.horizontalCenter
            width: 260
            height: userCard.height

            Rectangle {
                id: userCard
                width: parent.width
                height: userColumn.height
                radius: 16
                color: "#b3000000"
                border.width: 1
                border.color: "#33ffffff"
                clip: true

                Column {
                    id: userColumn
                    width: parent.width

                    Item {
                        width: parent.width
                        height: 44

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 18
                            anchors.rightMargin: 14
                            spacing: 6

                            TextInput {
                                id: userInput
                                width: parent.width - userArrow.width - 6
                                anchors.verticalCenter: parent.verticalCenter
                                text: userModel.lastUser
                                color: "white"
                                font.family: "CaskaydiaCove Nerd Font"
                                font.pixelSize: 15
                                selectByMouse: true
                                clip: true

                                Keys.onReturnPressed: passwordInput.forceActiveFocus()
                                Keys.onEnterPressed: passwordInput.forceActiveFocus()
                                KeyNavigation.tab: passwordInput
                            }

                            Text {
                                id: userArrow
                                anchors.verticalCenter: parent.verticalCenter
                                text: "▾"
                                color: "white"
                                font.pixelSize: 13
                                rotation: userList.visible ? 180 : 0
                                Behavior on rotation { NumberAnimation { duration: 120 } }

                                MouseArea {
                                    anchors.fill: parent
                                    anchors.margins: -8
                                    onClicked: userList.visible = !userList.visible
                                }
                            }
                        }
                    }

                    Rectangle {
                        visible: userList.visible
                        width: parent.width
                        height: 1
                        color: "#26ffffff"
                    }

                    Column {
                        id: userList
                        visible: false
                        width: parent.width
                        padding: 4
                        spacing: 2

                        Repeater {
                            id: userRepeater
                            model: userModel
                            delegate: Rectangle {
                                width: userList.width - 8
                                height: 34
                                radius: 10
                                color: userRowMouse.containsMouse ? "#1fffffff" : "#00000000"

                                Text {
                                    anchors.fill: parent
                                    leftPadding: 12
                                    verticalAlignment: Text.AlignVCenter
                                    text: name
                                    color: "white"
                                    font.family: "CaskaydiaCove Nerd Font"
                                    font.pixelSize: 14
                                }

                                MouseArea {
                                    id: userRowMouse
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onClicked: {
                                        userInput.text = name
                                        userList.visible = false
                                        passwordInput.forceActiveFocus()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // PASSWORD
        FieldFrame {
            id: passwordFrame
            anchors.horizontalCenter: parent.horizontalCenter

            TextInput {
                id: passwordInput
                anchors.fill: parent
                anchors.leftMargin: 18
                anchors.rightMargin: 18
                verticalAlignment: TextInput.AlignVCenter
                color: "white"
                font.family: "CaskaydiaCove Nerd Font"
                font.pixelSize: 15
                echoMode: TextInput.Password
                selectByMouse: true
                clip: true

                Keys.onReturnPressed: sddm.login(userInput.text, passwordInput.text, root.sessionIndex)
                Keys.onEnterPressed: sddm.login(userInput.text, passwordInput.text, root.sessionIndex)
                KeyNavigation.backtab: userInput
                KeyNavigation.tab: loginButton
            }
        }

        // WM / SESSION -- same clipped-card pattern as the username field
        Item {
            anchors.horizontalCenter: parent.horizontalCenter
            width: 220
            height: sessionCard.height

            Rectangle {
                id: sessionCard
                width: parent.width
                height: sessionColumn.height
                radius: 14
                color: "#b3000000"
                border.width: 1
                border.color: "#33ffffff"
                clip: true

                Column {
                    id: sessionColumn
                    width: parent.width

                    Item {
                        width: parent.width
                        height: 38

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 16
                            anchors.rightMargin: 14
                            spacing: 6

                            Text {
                                width: parent.width - sessionArrow.width - 6
                                anchors.verticalCenter: parent.verticalCenter
                                text: root.sessionName
                                color: "white"
                                font.family: "CaskaydiaCove Nerd Font"
                                font.pixelSize: 14
                                elide: Text.ElideRight
                            }

                            Text {
                                id: sessionArrow
                                anchors.verticalCenter: parent.verticalCenter
                                text: "▾"
                                color: "white"
                                font.pixelSize: 12
                                rotation: sessionList.visible ? 180 : 0
                                Behavior on rotation { NumberAnimation { duration: 120 } }

                                MouseArea {
                                    anchors.fill: parent
                                    anchors.margins: -8
                                    onClicked: sessionList.visible = !sessionList.visible
                                }
                            }
                        }
                    }

                    Rectangle {
                        visible: sessionList.visible
                        width: parent.width
                        height: 1
                        color: "#26ffffff"
                    }

                    Column {
                        id: sessionList
                        visible: false
                        width: parent.width
                        padding: 4
                        spacing: 2

                        Repeater {
                            id: sessionRepeater
                            model: sessionModel
                            delegate: Rectangle {
                                width: sessionList.width - 8
                                height: 30
                                radius: 8
                                color: sessionRowMouse.containsMouse ? "#1fffffff" : "#00000000"

                                Text {
                                    anchors.fill: parent
                                    leftPadding: 10
                                    verticalAlignment: Text.AlignVCenter
                                    text: name
                                    color: "white"
                                    font.family: "CaskaydiaCove Nerd Font"
                                    font.pixelSize: 13
                                }

                                Component.onCompleted: if (index === root.sessionIndex) root.sessionName = name

                                MouseArea {
                                    id: sessionRowMouse
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    onClicked: {
                                        root.sessionIndex = index
                                        root.sessionName = name
                                        sessionList.visible = false
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // STATUS (login failed / info messages)
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: root.statusText
            color: root.statusColor
            font.family: "CaskaydiaCove Nerd Font"
            font.pixelSize: 13
            height: 16
        }

        // LOGIN + POWER ROW, same glyph family as waybar's custom/power (⏻)
        Row {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 18

            Text {
                id: loginButton
                text: "Log In"
                color: "white"
                font.family: "CaskaydiaCove Nerd Font"
                font.pixelSize: 15

                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -8
                    onClicked: sddm.login(userInput.text, passwordInput.text, root.sessionIndex)
                }
            }

            Text {
                text: "⏻"
                color: "white"
                font.pixelSize: 18
                visible: sddm.canPowerOff

                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -8
                    onClicked: sddm.powerOff()
                }
            }

            Text {
                text: "⟳"
                color: "white"
                font.pixelSize: 18
                visible: sddm.canReboot

                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -8
                    onClicked: sddm.reboot()
                }
            }

            Text {
                text: "⏾"
                color: "white"
                font.pixelSize: 18
                visible: sddm.canSuspend

                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -8
                    onClicked: sddm.suspend()
                }
            }
        }
    }

    Component.onCompleted: {
        if (userInput.text === "")
            userInput.forceActiveFocus()
        else
            passwordInput.forceActiveFocus()
    }
}
