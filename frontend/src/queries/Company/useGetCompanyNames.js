import { supabase } from "../../supabase";

const useGetKeyByCompanyNames = () =>{
  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("COMPANY")
      .select("company_name", "company_id")

    return {data, error}
  };
  return {fetchCompanies}
};

export default useGetKeyByCompanyNames;