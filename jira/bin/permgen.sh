#
# This will try to detect whether the PermGen command line arguments can be used.
# On an IBM JVM, the default permgen arguments are not valid
#

# DO NOT remove the following line
JAVA_HOME="/opt/jira/jre/"; export JAVA_HOME

# let Tomcat's setclasspath.sh figure out the java location for us
if $os400; then
  # -r will Only work on the os400 if the files are:
  # 1. owned by the user
  # 2. owned by the PRIMARY group of the user
  # this will not work if the user belongs in secondary groups
  MY_JRE_HOME=`( BASEDIR="$CATALINA_HOME"; . "$CATALINA_HOME"/bin/setclasspath.sh; echo $JRE_HOME )`
  MY_JAVA_HOME=`( BASEDIR="$CATALINA_HOME"; . "$CATALINA_HOME"/bin/setclasspath.sh; echo $JAVA_HOME )`
else
  if [ -r "$CATALINA_HOME"/bin/setclasspath.sh ]; then
    MY_JRE_HOME=`( BASEDIR="$CATALINA_HOME"; . "$CATALINA_HOME"/bin/setclasspath.sh; echo $JRE_HOME )`
    MY_JAVA_HOME=`( BASEDIR="$CATALINA_HOME"; . "$CATALINA_HOME"/bin/setclasspath.sh; echo $JAVA_HOME )`
  else
    echo "Cannot find $CATALINA_HOME/bin/setclasspath.sh"
    echo "This file is needed to run this program"
    exit 1
  fi
fi

#
# Catalina looks in 2 places  - JAVA_HOME and JRE_HOME
#
JAVA_PERMGEN_SUPPORTED=true
JAVA_LOCATION=${MY_JAVA_HOME}
if [ -z "$MY_JAVA_HOME" ]; then
    JAVA_LOCATION=${MY_JRE_HOME}
fi    

#
# Determine which JVM is being used
#
if [ -n "${JAVA_LOCATION}" ]; then
    if [ -x "${JAVA_LOCATION}"/bin/java ]; then
        "${JAVA_LOCATION}"/bin/java -version 2>&1 | grep IBM
        RT_CODE=$?
        if [ ${RT_CODE} -eq 0 ]; then
            JAVA_PERMGEN_SUPPORTED=false
        fi
    fi
fi
export JAVA_PERMGEN_SUPPORTED
