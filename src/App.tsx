import { useForm } from "react-hook-form";
import { AuthService } from "./services/auth";
import { setSession } from "./storage/slices/session";
import { useReduxDispatch, useRedux } from "./hooks/reduxHooks";
import { Input } from "./components/Input";

interface ILoginForm {
  email: string;
  password: string;
}

function App() {
  const dispatch = useReduxDispatch();
  const accessToken = useRedux((state) => state.session.accessToken);

  const loginForm = useForm<ILoginForm>({
    defaultValues: { email: "", password: "" },
  });

  const onLogin = async () => {
    const {
      data: {
        data: { user, jwt },
      },
    } = await AuthService.login(loginForm.getValues());
    dispatch(setSession({ accessToken: jwt, user }));
  };

  return (
    <div>
      <h1>Login:</h1>
      <label>
        Email
        <Input />
      </label>

      <label>
        Senha
        <input {...loginForm.register("password")} type="password" />
      </label>

      <button onClick={onLogin}>Login</button>
      <hr />
      <p>Access token: {accessToken ?? "No access token"}</p>
    </div>
  );
}

export default App;
