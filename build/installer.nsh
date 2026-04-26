!macro customInstallMode
  StrCpy $isForceCurrentInstall "1"
!macroend

!macro preInit
  SetShellVarContext current
  StrCpy $INSTDIR "$EXEDIR\CozyTownPrototype"
  SetRegView 64
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$EXEDIR\CozyTownPrototype"
  SetRegView 32
  WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "$EXEDIR\CozyTownPrototype"
!macroend
