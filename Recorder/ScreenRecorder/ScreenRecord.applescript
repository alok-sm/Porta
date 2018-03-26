#!/usr/bin/osascript
on run argv
	set filename to "default"

	repeat
		tell application "System Events"
			set activeApp to name of first application process whose frontmost is true
		end tell

		tell application "System Events" to tell application process activeApp
			try
				set appPosition to position of first window
				set appSize to size of first window

				exit repeat
			end try
		end tell
	end repeat

	
	if (count of argv) > 0 then
		set filename to item 1 of argv
	end if
	
	set filePath to (path to movies folder as string) & filename & ".mov"
	set fileTarget to "/Users/alok/.porta/StopScreenRecording"

	tell application "QuickTime Player"
		activate
		set newScreenRecording to new screen recording
		delay 1
		tell application "System Events"
			tell process "QuickTime Player"
				set frontmost to true
				key code 49
				do shell script "/Users/alok/dev/HciResearch/Porta/Recorder/ScreenRecorder/cliclick c:" & (item 1 of appPosition + (item 1 of appSize)/2 as integer) & "," & (item 2 of appPosition + 5)
				do shell script "/Users/alok/dev/HciResearch/Porta/Recorder/ScreenRecorder/cliclick c:" & (item 1 of appPosition + (item 1 of appSize)/2 as integer) & "," & (item 2 of appPosition + 5)
				do shell script "/Users/alok/dev/HciResearch/Porta/Recorder/ScreenRecorder/cliclick c:" & (item 1 of appPosition + (item 1 of appSize)/2 as integer) & "," & (item 2 of appPosition + 5)
			end tell
		end tell
		
		tell newScreenRecording to start

		repeat
			delay 0.2
			try
				POSIX file fileTarget as alias
				do shell script "rm " & fileTarget
				exit repeat
			end try
		end repeat


		tell newScreenRecording to stop
		
		export document 1 in (file filePath) using settings preset "1080p"
		close document 1 saving no
		
		tell application "QuickTime Player"
			try
				set miniaturized of windows to true
			end try
			try
				set collapsed of windows to true
			end try
		end tell
	end tell
	
end run