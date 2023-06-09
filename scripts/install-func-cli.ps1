#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project root for full license information.
#
$arch = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture.ToString().ToLowerInvariant()
if ($IsWindows) {
    $FUNC_EXE_NAME = "func.exe"
    $os = "win"
} else {
    $FUNC_EXE_NAME = "func"
    if ($IsMacOS) {
        $os = "osx"
    } else {
        $os = "linux"
    }
}

Write-Host "Install Functions Core Tools for integration tests" -fore Green
$FUNC_RUNTIME_VERSION = '4'
$coreToolsDownloadURL = "https://functionsintegclibuilds.blob.core.windows.net/builds/$FUNC_RUNTIME_VERSION/latest/Azure.Functions.Cli.$os-$arch.zip"
$env:CORE_TOOLS_URL = "https://functionsintegclibuilds.blob.core.windows.net/builds/$FUNC_RUNTIME_VERSION/latest"

$FUNC_CLI_DIRECTORY = Join-Path $PSScriptRoot '..' 'func-cli'

Write-Host 'Deleting Functions Core Tools if exists...'
Remove-Item -Force "$FUNC_CLI_DIRECTORY.zip" -ErrorAction Ignore
Remove-Item -Recurse -Force $FUNC_CLI_DIRECTORY -ErrorAction Ignore

$version = Invoke-RestMethod -Uri "$env:CORE_TOOLS_URL/version.txt"
$version = $version.Trim()
Write-Host "Downloading Functions Core Tools (Version: $version)..."

$output = "$FUNC_CLI_DIRECTORY.zip"
Write-Host "Functions Core Tools download URL: $coreToolsDownloadURL"
Invoke-RestMethod -Uri $coreToolsDownloadURL -OutFile $output

Write-Host 'Extracting Functions Core Tools...'
Expand-Archive $output -DestinationPath $FUNC_CLI_DIRECTORY

Remove-Item -Force "$FUNC_CLI_DIRECTORY.zip" -ErrorAction Ignore

$funcExePath = Join-Path $FUNC_CLI_DIRECTORY $FUNC_EXE_NAME
if ($IsMacOS -or $IsLinux) {
    chmod +x $funcExePath
}
