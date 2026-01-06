

while True:

    text = input("enter string:\n")

    textArr= text.split(" ")

    # print(textArr)

    newText=""
    for i in textArr:
        newText+= "<span>"+i+"</span> "

    # pyperclip.copy(newText)
    print(newText)
    print("")
